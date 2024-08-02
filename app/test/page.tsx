import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default async function TestPage() {
  return (
    <div className="flex items-center justify-center h-dvh">
      <Drawer shouldScaleBackground={true}>
        <DrawerTrigger>
          <Button
            variant={"outline"}
            size={"lg"}
            className="text-xl font-semibold"
          >
            Open
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-5/6">
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
