import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface PredictionRequest {
  property_type: string;
  "capacity / persons": number;
  rooms: number;
  beds: number;
  City: string;
  Country: string;
  "num of bathrooms": number;
  "Wireless Internet": number;
  "Free Parking on Premises": number;
  "Pets Allowed": number;
  Pool: number;
  "Climatisation / AC": number;
  "Cheminée": number;
  "Family/Kid Friendly": number;
  "Hot Tub": number;
  "Hot Water": number;
  "Elevator in Building": number;
  Heating: number;
  Kitchen: number;
  TV: number;
  Essentials: number;
  Washer: number;
}

export const getPricePrediction = async (formData: any): Promise<number> => {
  const equipmentMap: { [key: string]: string } = {
    wifi: "Wireless Internet",
    parking: "Free Parking on Premises",
    pets: "Pets Allowed",
    pool: "Pool",
    ac: "Climatisation / AC",
    fireplace: "Cheminée",
    family: "Family/Kid Friendly",
    hottub: "Hot Tub",
    hotwater: "Hot Water",
    elevator: "Elevator in Building",
    heating: "Heating",
    kitchen: "Kitchen",
    tv: "TV",
    essentials: "Essentials",
    washer: "Washer"
  };

  const requestData: PredictionRequest = {
    property_type: formData.propertyType,
    "capacity / persons": Number(formData.capacity),
    rooms: Number(formData.rooms),
    beds: Number(formData.beds),
    City: formData.city,
    Country: "Tunisia",
    "num of bathrooms": Number(formData.bathrooms),
    "Wireless Internet": formData.equipment.includes("wifi") ? 1 : 0,
    "Free Parking on Premises": formData.equipment.includes("parking") ? 1 : 0,
    "Pets Allowed": formData.equipment.includes("pets") ? 1 : 0,
    "Pool": formData.equipment.includes("pool") ? 1 : 0,
    "Climatisation / AC": formData.equipment.includes("ac") ? 1 : 0,
    "Cheminée": formData.equipment.includes("fireplace") ? 1 : 0,
    "Family/Kid Friendly": formData.equipment.includes("family") ? 1 : 0,
    "Hot Tub": formData.equipment.includes("hottub") ? 1 : 0,
    "Hot Water": formData.equipment.includes("hotwater") ? 1 : 0,
    "Elevator in Building": formData.equipment.includes("elevator") ? 1 : 0,
    "Heating": formData.equipment.includes("heating") ? 1 : 0,
    "Kitchen": formData.equipment.includes("kitchen") ? 1 : 0,
    "TV": formData.equipment.includes("tv") ? 1 : 0,
    "Essentials": formData.equipment.includes("essentials") ? 1 : 0,
    "Washer": formData.equipment.includes("washer") ? 1 : 0
  };

  try {
    const response = await axios.post(`${API_URL}/predict/`, requestData);
    return response.data.predicted_price;
  } catch (error) {
    console.error('Error getting prediction:', error);
    throw error;
  }
};