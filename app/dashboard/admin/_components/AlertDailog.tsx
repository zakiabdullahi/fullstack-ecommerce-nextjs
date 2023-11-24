import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { API } from "@/lib/config";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

const AlertDailog = ({ id, schema }: { id: string; schema: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${API}/admin/${schema}/${id}`);

      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: [schema] });
      setLoading(false);
    } catch (error) {
      setLoading(false);

      toast.error("Something Won't happen");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant={"destructive"}>
          {loading ? "Deleting ..." : "Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDailog;
