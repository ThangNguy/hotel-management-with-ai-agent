import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { HotelService } from '../../../services/hotel.service';
import { Room } from '../../../models/room.model';
import { Booking, BookingStatus } from '../../../models/booking.model';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgClass,
    DatePipe,
    CurrencyPipe
  ]
})
export class AdminDashboardComponent implements OnInit {
  // Dashboard metrics
  totalRooms = 0;
  availableRooms = 0;
  occupancyRate = 0;
  totalBookings = 0;
  monthlyRevenue = 0;
  
  // Recent bookings
  recentBookings: Booking[] = [];
  displayedColumns: string[] = ['id', 'guestName', 'roomType', 'checkIn', 'checkOut', 'status', 'totalPrice'];
  
  // Data loading state
  isLoading = true;

  constructor(private hotelService: HotelService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Get rooms data directly then use getRoomsAsync for Observable approach
    const rooms = this.hotelService.getRooms();
    this.totalRooms = rooms.length;
    this.availableRooms = this.calculateAvailableRooms(rooms);
    this.occupancyRate = this.calculateOccupancyRate();
    
    // Load bookings data
    this.loadBookingsData();
  }

  loadBookingsData(): void {
    // Get bookings data directly then use getBookingsAsync for Observable approach
    const bookings = this.hotelService.getBookings();
    this.totalBookings = bookings.length;
    this.monthlyRevenue = this.calculateMonthlyRevenue(bookings);
    this.recentBookings = this.getRecentBookings(bookings, 5);
    this.isLoading = false;
  }

  private calculateAvailableRooms(rooms: Room[]): number {
    // Sử dụng các booking hiện tại để kiểm tra phòng nào đang trống
    const currentDate = new Date();
    
    return rooms.filter(room => {
      // Kiểm tra phòng không có booking nào trong ngày hôm nay
      return this.hotelService.checkRoomAvailability(
        room.id, 
        currentDate, 
        currentDate
      );
    }).length;
  }

  private calculateOccupancyRate(): number {
    if (this.totalRooms === 0) return 0;
    return ((this.totalRooms - this.availableRooms) / this.totalRooms) * 100;
  }

  private calculateMonthlyRevenue(bookings: Booking[]): number {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    // Sum up revenue from bookings in the current month
    return bookings
      .filter(booking => {
        const bookingDate = new Date(booking.checkInDate);
        return bookingDate >= firstDayOfMonth && bookingDate <= currentDate;
      })
      .reduce((total, booking) => total + booking.totalPrice, 0);
  }

  private getRecentBookings(bookings: Booking[], count: number): Booking[] {
    // Sort bookings by date (newest first) using createdAt field instead of bookingDate
    return [...bookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, count);
  }

  getBookingStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'status-confirmed';
      case 'checked-in': return 'status-checked-in';
      case 'checked-out': return 'status-checked-out';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }
}