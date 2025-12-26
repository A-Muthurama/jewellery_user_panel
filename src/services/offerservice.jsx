// TEMP: mock implementation
import { OFFERS } from "../data/mockData";

export const fetchOffers = async () => {
  await new Promise(res => setTimeout(res, 500));

  return OFFERS.filter(
    offer => new Date(offer.validUntil) >= new Date()
  );
};

export const fetchOfferById = async (id) => {
  await new Promise(res => setTimeout(res, 300));
  return OFFERS.find(o => o.id === Number(id));
};
