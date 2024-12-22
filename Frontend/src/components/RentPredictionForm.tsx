import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getPricePrediction } from "@/services/api";
import EquipmentSection from "./EquipmentSection";
import { cities, propertyTypes } from "@/constants/formOptions";

const RentPredictionForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    propertyType: "",
    capacity: "",
    rooms: "",
    beds: "",
    city: "",
    bathrooms: "",
    equipment: [] as string[],
  });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const predictedPrice = await getPricePrediction(formData);
      setPrediction(predictedPrice);
      toast({
        title: "Price Prediction Complete",
        description: "We've calculated the estimated nightly rate for your property.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get price prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | string[] | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                onValueChange={(value) => handleInputChange("propertyType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (Persons)</Label>
              <Input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
                placeholder="Enter capacity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rooms">Number of Rooms</Label>
              <Input
                type="number"
                min="1"
                value={formData.rooms}
                onChange={(e) => handleInputChange("rooms", e.target.value)}
                placeholder="Enter number of rooms"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beds">Number of Beds</Label>
              <Input
                type="number"
                min="1"
                value={formData.beds}
                onChange={(e) => handleInputChange("beds", e.target.value)}
                placeholder="Enter number of beds"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select onValueChange={(value) => handleInputChange("city", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Number of Bathrooms</Label>
              <Input
                type="number"
                min="1"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                placeholder="Enter number of bathrooms"
              />
            </div>
          </div>

          <EquipmentSection
            selectedEquipment={formData.equipment}
            onEquipmentChange={(equipment) => handleInputChange("equipment", equipment)}
          />

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? "Calculating..." : "Calculate Price"}
          </Button>
        </Card>
      </form>

      {prediction && (
        <Card className="p-6 animate-fade-in">
          <h3 className="text-2xl font-bold text-center mb-4">
            Estimated Nightly Rate
          </h3>
          <p className="text-4xl text-center text-primary font-bold">
            TND{prediction}
          </p>
          <p className="text-center text-muted-foreground mt-2">
            This estimation using AI
          </p>
        </Card>
      )}
    </div>
  );
};

export default RentPredictionForm;