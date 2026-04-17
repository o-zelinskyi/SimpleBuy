import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './core/services/auth.service';
import { ProjectService } from './core/services/project.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, HttpClientTestingModule],
      providers: [AuthService, ProjectService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpClientTestingModule);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false for isLoggedIn when user is not logged in', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should return null for getCurrentUser when user is not logged in', () => {
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should return false for isAdmin when user is not admin', () => {
    expect(service.isAdmin()).toBe(false);
  });

  it('should clear user data on logout', () => {
    const mockUser = {
      id: 1,
      fullName: 'Test User',
      email: 'test@test.com',
      roleId: 2,
      roleName: 'Seller',
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));

    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('should deny canEdit permissions for seller with other seller project', () => {
    const mockUser = {
      id: 5,
      fullName: 'Seller User',
      email: 'seller@test.com',
      roleId: 2,
      roleName: 'Seller',
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    
    const newService = TestBed.inject(AuthService);
    expect(newService.canEdit(10)).toBe(false);
  });
});

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService],
    });
    service = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have getAll method', () => {
    expect(service.getAll).toBeDefined();
  });

  it('should have getById method', () => {
    expect(service.getById).toBeDefined();
  });

  it('should have create method', () => {
    expect(service.create).toBeDefined();
  });

  it('should have update method', () => {
    expect(service.update).toBeDefined();
  });

  it('should have delete method', () => {
    expect(service.delete).toBeDefined();
  });
});
