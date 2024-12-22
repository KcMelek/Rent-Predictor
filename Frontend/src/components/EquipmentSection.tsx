import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import * as Icons from "lucide-react";
import { equipmentOptions } from "@/constants/formOptions";

interface EquipmentSectionProps {
  selectedEquipment: string[];
  onEquipmentChange: (equipment: string[]) => void;
}

const EquipmentSection = ({ selectedEquipment, onEquipmentChange }: EquipmentSectionProps) => {
  const handleEquipmentChange = (id: string, checked: boolean) => {
    if (checked) {
      onEquipmentChange([...selectedEquipment, id]);
    } else {
      onEquipmentChange(selectedEquipment.filter((item) => item !== id));
    }
  };

  return (
    <div className="mt-6">
      <Label>Equipment & Amenities</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
        {equipmentOptions.map(({ id, label, icon }) => {
          const Icon = Icons[icon as keyof typeof Icons] as React.ElementType;
          return (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={selectedEquipment.includes(id)}
                onCheckedChange={(checked) => handleEquipmentChange(id, checked as boolean)}
              />
              <Label htmlFor={id} className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EquipmentSection;