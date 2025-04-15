import { Injectable } from '@angular/core';
import { Room } from '../models/room.model';
import { Booking, BookingStatus } from '../models/booking.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private roomsSubject = new BehaviorSubject<Room[]>(this.getMockRooms());
  rooms$ = this.roomsSubject.asObservable();
  
  private bookingsSubject = new BehaviorSubject<Booking[]>(this.getMockBookings());
  bookings$ = this.bookingsSubject.asObservable();

  constructor() { }

  // Room Management Methods
  getRooms(): Room[] {
    return this.roomsSubject.value;
  }
  
  getRoomsAsync(): Observable<Room[]> {
    return of(this.roomsSubject.value).pipe(delay(500));
  }

  getRoomById(id: number): Room | undefined {
    return this.roomsSubject.value.find(room => room.id === id);
  }
  
  addRoom(room: Omit<Room, 'id'>): Observable<Room> {
    const rooms = this.roomsSubject.value;
    const newId = Math.max(0, ...rooms.map(r => r.id)) + 1;
    const newRoom: Room = { ...room, id: newId };
    
    const updatedRooms = [...rooms, newRoom];
    this.roomsSubject.next(updatedRooms);
    
    return of(newRoom).pipe(delay(500));
  }
  
  updateRoom(updatedRoom: Room): Observable<Room> {
    const rooms = this.roomsSubject.value;
    const updatedRooms = rooms.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    );
    
    this.roomsSubject.next(updatedRooms);
    return of(updatedRoom).pipe(delay(500));
  }
  
  deleteRoom(id: number): Observable<boolean> {
    const rooms = this.roomsSubject.value;
    const updatedRooms = rooms.filter(room => room.id !== id);
    
    // Check if any bookings use this room
    const bookings = this.bookingsSubject.value;
    const hasBookings = bookings.some(booking => booking.roomId === id);
    
    if (hasBookings) {
      return of(false).pipe(delay(500));
    }
    
    this.roomsSubject.next(updatedRooms);
    return of(true).pipe(delay(500));
  }
  
  // Booking Management Methods
  getBookings(): Booking[] {
    return this.bookingsSubject.value;
  }
  
  getBookingsAsync(): Observable<Booking[]> {
    return of(this.bookingsSubject.value).pipe(delay(500));
  }
  
  getBookingById(id: number): Booking | undefined {
    return this.bookingsSubject.value.find(booking => booking.id === id);
  }
  
  addBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Observable<Booking> {
    const bookings = this.bookingsSubject.value;
    const newId = Math.max(0, ...bookings.map(b => b.id)) + 1;
    
    const newBooking: Booking = { 
      ...booking, 
      id: newId, 
      createdAt: new Date(),
      status: BookingStatus.PENDING
    };
    
    const updatedBookings = [...bookings, newBooking];
    this.bookingsSubject.next(updatedBookings);
    
    return of(newBooking).pipe(delay(500));
  }
  
  updateBooking(updatedBooking: Booking): Observable<Booking> {
    const bookings = this.bookingsSubject.value;
    const updatedBookings = bookings.map(booking => 
      booking.id === updatedBooking.id ? updatedBooking : booking
    );
    
    this.bookingsSubject.next(updatedBookings);
    return of(updatedBooking).pipe(delay(500));
  }
  
  deleteBooking(id: number): Observable<boolean> {
    const bookings = this.bookingsSubject.value;
    const updatedBookings = bookings.filter(booking => booking.id !== id);
    
    this.bookingsSubject.next(updatedBookings);
    return of(true).pipe(delay(500));
  }
  
  updateBookingStatus(bookingId: number, status: BookingStatus): Observable<Booking> {
    const bookings = this.bookingsSubject.value;
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
      return of(null as any).pipe(delay(500));
    }
    
    const updatedBooking: Booking = { ...booking, status };
    return this.updateBooking(updatedBooking);
  }
  
  // Check room availability for the given dates
  checkRoomAvailability(roomId: number, checkIn: Date, checkOut: Date): boolean {
    const bookings = this.bookingsSubject.value.filter(
      b => b.roomId === roomId && 
      b.status !== BookingStatus.CANCELLED
    );
    
    return !bookings.some(booking => {
      const bookingCheckIn = new Date(booking.checkInDate);
      const bookingCheckOut = new Date(booking.checkOutDate);
      
      return (
        (checkIn >= bookingCheckIn && checkIn < bookingCheckOut) ||
        (checkOut > bookingCheckIn && checkOut <= bookingCheckOut) ||
        (checkIn <= bookingCheckIn && checkOut >= bookingCheckOut)
      );
    });
  }

  getAvailableRooms(checkIn: Date, checkOut: Date, capacity: number): Room[] {
    const rooms = this.roomsSubject.value;
    
    return rooms.filter(room => {
      return room.capacity >= capacity && 
        this.checkRoomAvailability(room.id, checkIn, checkOut);
    });
  }
  
  // Danh sách các tiện nghi của khách sạn
  getAmenities(): any[] {
    return [
      {
        name: 'Hồ bơi vô cực',
        description: 'Hồ bơi vô cực với tầm nhìn panorama ra thành phố và biển.',
        icon: 'pool'
      },
      {
        name: 'Nhà hàng 5 sao',
        description: 'Nhà hàng với các món ăn quốc tế và đặc sản địa phương từ đầu bếp nổi tiếng.',
        icon: 'restaurant'
      },
      {
        name: 'Spa & Massage',
        description: 'Dịch vụ spa cao cấp với đa dạng các liệu pháp thư giãn và làm đẹp.',
        icon: 'spa'
      },
      {
        name: 'Phòng tập Gym',
        description: 'Phòng tập hiện đại với đầy đủ thiết bị và huấn luyện viên cá nhân.',
        icon: 'fitness_center'
      },
      {
        name: 'Phòng họp & Hội nghị',
        description: 'Các phòng họp đa năng với thiết bị hiện đại, phù hợp cho hội nghị và sự kiện.',
        icon: 'business_center'
      },
      {
        name: 'Dịch vụ đưa đón',
        description: 'Dịch vụ đưa đón sân bay và tham quan thành phố bằng xe sang.',
        icon: 'airport_shuttle'
      },
      {
        name: 'WiFi miễn phí',
        description: 'Kết nối internet tốc độ cao miễn phí trong toàn bộ khuôn viên.',
        icon: 'wifi'
      },
      {
        name: 'Dịch vụ phòng 24/7',
        description: 'Dịch vụ phòng chuyên nghiệp, sẵn sàng phục vụ mọi lúc.',
        icon: 'room_service'
      }
    ];
  }
  
  // Private helper methods
  private getMockRooms(): Room[] {
    return [
      {
        id: 1,
        name: 'Phòng Deluxe Đơn',
        description: 'Phòng sang trọng với thiết kế hiện đại và đầy đủ tiện nghi, phù hợp cho 1-2 người. Tầm nhìn ra thành phố.',
        price: 1500000,
        capacity: 2,
        size: 32,
        imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWwlMjByb29tfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
        amenities: [
          'Wi-Fi miễn phí', 'Điều hòa', 'TV màn hình phẳng', 'Minibar', 
          'Két sắt', 'Máy pha cà phê', 'Phòng tắm đá cẩm thạch'
        ]
      },
      {
        id: 2,
        name: 'Phòng Premier',
        description: 'Phòng rộng rãi với không gian sống thoải mái, thiết kế sang trọng và view đẹp. Phù hợp cho cặp đôi.',
        price: 2200000,
        capacity: 2,
        size: 40,
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
        amenities: [
          'Wi-Fi miễn phí', 'Điều hòa', 'TV màn hình phẳng', 'Minibar', 
          'Két sắt', 'Máy pha cà phê', 'Phòng tắm đá cẩm thạch', 'Bồn tắm', 'Ban công'
        ]
      },
      {
        id: 3,
        name: 'Suite Gia Đình',
        description: 'Suite rộng rãi với hai phòng ngủ và phòng khách riêng biệt, phù hợp cho gia đình. Tầm nhìn panorama.',
        price: 3500000,
        capacity: 4,
        size: 65,
        imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
        amenities: [
          'Wi-Fi miễn phí', 'Điều hòa', 'TV màn hình phẳng', 'Minibar', 'Két sắt', 
          'Máy pha cà phê', 'Phòng tắm đá cẩm thạch', 'Bồn tắm', 'Ban công', 
          'Phòng khách riêng', 'Bàn làm việc'
        ]
      },
      {
        id: 4,
        name: 'Suite Tổng Thống',
        description: 'Suite đẳng cấp với diện tích lớn cùng tiện nghi cao cấp, thiết kế sang trọng và dịch vụ đặc biệt.',
        price: 8000000,
        capacity: 2,
        size: 120,
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWwlMjBzdWl0ZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
        amenities: [
          'Wi-Fi miễn phí', 'Điều hòa', 'TV màn hình phẳng', 'Minibar', 'Két sắt', 
          'Máy pha cà phê', 'Phòng tắm đá cẩm thạch', 'Bồn tắm', 'Ban công', 
          'Phòng khách riêng', 'Bàn làm việc', 'Phòng ăn riêng', 
          'Dịch vụ quản gia', 'Giường King-size'
        ]
      }
    ];
  }
  
  private getMockBookings(): Booking[] {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    const nextWeekPlusTwo = new Date();
    nextWeekPlusTwo.setDate(now.getDate() + 9);
    
    return [
      {
        id: 1,
        roomId: 1,
        guestName: 'Nguyễn Văn A',
        guestEmail: 'nguyenvana@example.com',
        guestPhone: '0901234567',
        checkInDate: tomorrow,
        checkOutDate: nextWeek,
        numberOfGuests: 2,
        totalPrice: 1500000 * 6, // 6 nights
        status: BookingStatus.CONFIRMED,
        specialRequests: 'Phòng trên tầng cao, xa thang máy',
        createdAt: now
      },
      {
        id: 2,
        roomId: 3,
        guestName: 'Trần Thị B',
        guestEmail: 'tranthib@example.com',
        guestPhone: '0912345678',
        checkInDate: nextWeek,
        checkOutDate: nextWeekPlusTwo,
        numberOfGuests: 4,
        totalPrice: 3500000 * 2, // 2 nights
        status: BookingStatus.PENDING,
        specialRequests: 'Cần thêm giường phụ cho trẻ em',
        createdAt: now
      }
    ];
  }
}
