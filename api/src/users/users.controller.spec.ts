import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service to create a user', async () => {
      const createUserDto: CreateUserDto = { email: 'test@test.com', name: 'testuser', password: 'password' };
      const user = { id: 'some-uuid', ...createUserDto };
      mockUsersService.create.mockResolvedValue(user);

      const result = await controller.create(createUserDto);
      expect(result).toEqual(user);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should call the service to find all users', async () => {
      const users = [{ id: '1', name: 'Test User' }];
      mockUsersService.findAll.mockResolvedValue(users);
      const result = await controller.findAll();
      expect(result).toEqual(users);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call the service to find one user', async () => {
      const user = { id: '1', name: 'Test User' };
      mockUsersService.findOne.mockResolvedValue(user);
      const result = await controller.findOne('1');
      expect(result).toEqual(user);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should call the service to update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const user = { id: '1', name: 'Updated Name' };
      mockUsersService.update.mockResolvedValue(user);

      const result = await controller.update('1', updateUserDto);
      expect(result).toEqual(user);
      expect(mockUsersService.update).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should call the service to remove a user', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);
      expect(mockUsersService.remove).toHaveBeenCalledWith('1');
    });
  });
});
