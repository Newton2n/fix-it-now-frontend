export type AvailabilityDay = {
  start: string;
  end: string;
};

export type TechnicianAvailability = Record<
  string,
  AvailabilityDay
>;