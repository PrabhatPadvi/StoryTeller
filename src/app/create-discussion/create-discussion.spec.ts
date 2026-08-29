import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDiscussion } from './create-discussion';

describe('CreateDiscussion', () => {
  let component: CreateDiscussion;
  let fixture: ComponentFixture<CreateDiscussion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDiscussion],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateDiscussion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
