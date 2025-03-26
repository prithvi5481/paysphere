import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";

const CustomInput = ({form, label, placeholder, name}: CustomInputProps) => {
  return (
    <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
        <div className="form-item">
        <FormLabel className="form-label">{label}</FormLabel>
        <div className="flex w-full flex-col">
            <FormControl>
            <Input
                {...field}
                type={name === 'password' ? 'password' : 'text'}
                placeholder={placeholder}
                className="input-class"
            />
            </FormControl>
            <FormMessage className="form-message mt-2" />
        </div>
        </div>
    )}
    />
  );
};

export default CustomInput;
