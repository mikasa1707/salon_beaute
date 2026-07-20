import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cash-register',
  imports: [],
  templateUrl: './cash-register.html',
  styleUrl: './cash-register.scss',
})
export class CashRegister implements OnInit {
  ngOnInit(): void {
    const facturationId = history.state.facturationId;
  }
}
