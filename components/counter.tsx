import { ChangeEvent, MouseEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Props = {
  defaultValue: number;
  maxValue: number;
};
export const Counter = ({ defaultValue, maxValue }: Props) => {
  const [value, setValue] = useState<string>(defaultValue.toString);

  const handleCountChange = (e: MouseEvent<HTMLButtonElement>) => {
    const addValue: number = Number(e.currentTarget.value);
    setValue((prev) => {
      const prevNumber: number = Number(prev);

      if (prevNumber + addValue <= 1) {
        return "1";
      } else if (prevNumber + addValue >= maxValue) {
        return maxValue.toString();
      } else {
        return (prevNumber + addValue).toString();
      }
    });
  };
  return (
    <>
      <div className="flex items-center gap-3">
        <Input
          className="text-right text-[16px]"
          value={value?.toString()}
          inputMode="numeric"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const regex = /^\d*$/;
            const value: string = e.target.value;
            setValue((prev) => {
              if (!regex.test(value)) {
                return prev;
              } else {
                return value;
              }
            });
          }}
        />
        <span className="text-lg">袋</span>
      </div>
      <div className="grid grid-cols-6 gap-2 items-center">
        <Button variant={"secondary"} onClick={() => setValue("1")}>
          1
        </Button>
        <Button variant={"secondary"} value={-10} onClick={handleCountChange}>
          -10
        </Button>
        <Button variant={"secondary"} value={-1} onClick={handleCountChange}>
          -1
        </Button>
        <Button variant={"secondary"} value={1} onClick={handleCountChange}>
          +1
        </Button>
        <Button variant={"secondary"} value={10} onClick={handleCountChange}>
          +10
        </Button>
        <Button
          variant={"secondary"}
          onClick={() => setValue(maxValue.toString())}
        >
          最大
        </Button>
      </div>
    </>
  );
};
