import { create } from 'zustand';
import { RoomService } from '../services/room.service';

interface Room {
  id: number;
  roomNumber: string;
  building: string;
  floor: number;
  capacity: number;
  currentCount: number;
  status: string;
  students?: any[];
  faults?: any[];
}

interface RoomState {
  rooms: Room[];
  selectedBuilding: string;
  isLoading: boolean;
  selectedRoom: Room | null;
  error: string | null;

  fetchRooms: (building: string) => Promise<void>;
  setBuilding: (building: string) => void;
  getRoomDetails: (roomId: number) => Promise<void>;
  updateRoomStatus: (roomId: number, status: string) => Promise<void>;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: [],
  selectedBuilding: 'المبنى أ', // Default to Building A (Arabic)
  isLoading: false,
  selectedRoom: null,
  error: null,

  fetchRooms: async (building: string) => {
    set({ isLoading: true, error: null });
    try {
      const rooms = await RoomService.getRoomsByBuilding(building);
      set({ rooms, isLoading: false });
    } catch (error) {
      console.error('Error fetching rooms:', error);
      set({ isLoading: false, error: 'Failed to fetch rooms' });
    }
  },

  setBuilding: (building: string) => {
    set({ selectedBuilding: building });
    get().fetchRooms(building);
  },

  getRoomDetails: async (roomId: number) => {
      set({ isLoading: true, error: null });
      try {
          const room = await RoomService.getRoomDetails(roomId);
          set({ selectedRoom: room, isLoading: false });
      } catch (error) {
          console.error('Error fetching room details:', error);
          set({ isLoading: false, error: 'Failed to fetch room details' });
      }
  },

  updateRoomStatus: async (roomId: number, status: string) => {
      // Just a pass-through for now as service logs it
      await RoomService.updateRoomStatus(roomId, status);
  }
}));
