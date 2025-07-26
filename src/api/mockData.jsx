// This file contains all the mock data for the application.
// You can modify these values to test different UI states.

export const mockUserStats = {
  level0: 10,
  level1: 100,
  level2: 20,
  level3: 5,
  total: 135,
  active: 125,
  suspended: 10,
};

export const mockVehicleStats = {
  pending: 12,
  approved: 90,
  rejected: 4,
  hidden: 6,
  total: 112,
};

export const mockUserRequests = [
  { id: 23, avatar: `https://i.pravatar.cc/150?u=23`, nickname: "alice", email: "alice@example.com", createdAt: "2024-07-01T08:15:32.000Z" },
  { id: 24, avatar: `https://i.pravatar.cc/150?u=24`, nickname: "bob", email: "bob@example.com", createdAt: "2024-07-02T09:20:10.000Z" },
  { id: 25, avatar: `https://i.pravatar.cc/150?u=25`, nickname: "charlie", email: "charlie@example.com", createdAt: "2024-07-03T11:45:00.000Z" },
  { id: 26, avatar: `https://i.pravatar.cc/150?u=26`, nickname: "diana", email: "diana@example.com", createdAt: "2024-07-04T12:00:00.000Z" },
  { id: 27, avatar: `https://i.pravatar.cc/150?u=27`, nickname: "ethan", email: "ethan@example.com", createdAt: "2024-07-05T14:30:00.000Z" },
];

export const mockVehicleRequests = [
  { id: 58, title: "Kia Morning 2021 – Yellow", brand: "Kia", imageFront: `https://placehold.co/600x400/FBBF24/333333?text=Kia+Morning`, vehicleRegistrationId: "51A-123.45" },
  { id: 59, title: "Ford Ranger 2020 – Blue", brand: "Ford", imageFront: `https://placehold.co/600x400/60A5FA/FFFFFF?text=Ford+Ranger`, vehicleRegistrationId: "50G-567.89" },
  { id: 60, title: "Toyota Vios 2022 - Red", brand: "Toyota", imageFront: `https://placehold.co/600x400/F87171/FFFFFF?text=Toyota+Vios`, vehicleRegistrationId: "59C-444.55" },
];
