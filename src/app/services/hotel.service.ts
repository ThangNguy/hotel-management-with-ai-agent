import { Injectable } from '@angular/core';
import { Room } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor() { }

  // Danh sách các phòng của khách sạn
  getRooms(): Room[] {
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
}
