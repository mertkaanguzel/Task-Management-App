import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOneBy: jest.fn(),
  createTask: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockUser = {
  username: 'MKG',
  id: 'Id',
  password: 'Password',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('mockResolvedValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('mockResolvedValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOneBy and returns the result', async () => {
      const mockTask = {
        title: 'Title',
        description: 'Description',
        id: 'Id',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findOneBy.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('Id', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOneBy.mockResolvedValue(null);
      expect(tasksService.getTaskById('Id', mockUser)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('calls TasksRepository.createTask and returns the result', async () => {
      const mockTask = {
        title: 'Title',
        description: 'Description',
        id: 'Id',
        status: TaskStatus.OPEN,
      };

      tasksRepository.createTask.mockResolvedValue(mockTask);
      const result = await tasksService.createTask(mockTask, mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTaskStatus', () => {
    it('calls TasksRepository.save and returns the result', async () => {
      const mockTask = {
        title: 'Title',
        description: 'Description',
        id: 'Id',
        status: TaskStatus.OPEN,
      };

      tasksService.getTaskById = jest.fn().mockResolvedValue(mockTask);

      tasksRepository.save.mockResolvedValue(mockTask);
      const result = await tasksService.updateTaskStatus(
        'Id',
        { status: TaskStatus.DONE },
        mockUser,
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('calls TasksRepository.delete and handles an error', async () => {
      const mockResult = {
        affected: 0,
      };
      tasksRepository.delete.mockResolvedValue(mockResult);
      expect(tasksService.deleteTask('Id', mockUser)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
