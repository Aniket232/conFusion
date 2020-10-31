import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import {formatDate} from '@angular/common';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Comments} from '../shared/comments';
import { trigger, state, style, animate, transition, animation } from '@angular/animations';

const comments = [];

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state('shown', style({
        transform: 'scale(1.0)',
        opacity: 1
      })),
      state('hidden', style({
        transform: 'scale(0.5)',
        opacity: 0
      })),
      transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  reviewForm: FormGroup;
  comments: Comments;
  dishcopy: Dish;
  visibility = 'shown';
 


  @ViewChild('fform') reviewFormDirective; 

  reviewErrors = {
    'author':'',
    'comment':''
  };

  ValidationMessages ={
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 3 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'comment is required.',
      'minlength':     'comment must be at least 4 characters long.',
      'maxlength':     'comment cannot be more than 55 characters long.'
    },
  }
  

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) { }

    ngOnInit() {
      this.commentsForm();

      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
    }
    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

    commentsForm() {
      this.reviewForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        rating: [5, Validators.required],
        comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        date:formatDate(new Date(), 'mediumDate', 'en')
      });

      this.reviewForm.valueChanges
       .subscribe(data => this.onValueChanged(data));

      this.onValueChanged(); // (re)set form  validation messages 
    }

    onValueChanged(data?: any) {
      if (!this.reviewForm) { return; }
      const form = this.reviewForm;
      for (const field in this.reviewErrors) {
        if (this.reviewErrors.hasOwnProperty(field)) {
         // clear previous error message ( if any)
         this.reviewErrors[field] = '';
         const control = form.get(field);
         if (control && control.dirty && !control.valid) {
          const messages  = this.ValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.reviewErrors[field] += messages[key] + ' ';
            }
          }
         }
        }
      }
    }
      

    // onSubmit() {
     
    //   comments.push( this.reviewForm.value );
    //   console.log(this.reviewForm.value)
    //   this.reviewForm.reset({
    //     name: '',
    //     rating: 5,
    //     comment: '',
    //     date:formatDate(new Date(), 'mediumDate', 'en')
    //   });
    //   this.reviewFormDirective.resetForm();
    // }

    onSubmit() {
      this.comments = this.reviewForm.value;
      this.comments.date = new Date().toISOString();
      console.log(this.comments);
      this.dishcopy.comments.push(this.comments);
      this.dishservice.putDish(this.dishcopy)
        .subscribe(dish =>{
          this.dish =dish; this.dishcopy = dish;
        },
        errmess => { this.dish =null; this.dishcopy = null; this.errMess = <any>errmess; });
      this.reviewFormDirective.resetForm();
      this.reviewForm.reset({
        author: '',
        rating: 5,
        comment: ''
      });
    }

  goBack(): void {
    this.location.back();
  }

}
