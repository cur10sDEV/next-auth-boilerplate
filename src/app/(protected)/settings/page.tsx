"use client";

import FormError from "@/components/shared/FormError";
import FormSuccess from "@/components/shared/FormSuccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { settingsSchema } from "@/schemas/settingsSchema";
import { updateSettings } from "@/server/actions/settingsAction";
import { typeSettingsSchema } from "@/types/settingsTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";

const SettingsPage = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState({ error: false, message: "" });
  const [success, setSuccess] = useState({ success: false, message: "" });

  const { update: updateSession } = useSession();
  const user = useCurrentUser();

  const settingsForm = useForm<typeSettingsSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = async (values: typeSettingsSchema) => {
    startTransition(() => {
      updateSettings(values).then((data) => {
        if (!data?.success) {
          setSuccess({ success: false, message: "" });
          setError({
            error: true,
            message: data?.message || "Failed to update settings!",
          });
        } else {
          setSuccess({
            success: true,
            message: data?.message || "Settings updated!",
          });
          setError({ error: false, message: "" });
          updateSession();
        }
      });
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-xl font-semibold text-center">⚙️ Settings</p>
      </CardHeader>
      <CardContent>
        <Form {...settingsForm}>
          <form
            className="space-y-6"
            onSubmit={settingsForm.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <FormField
                control={settingsForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="John Doe"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.isOAuth === false && (
                <>
                  <FormField
                    control={settingsForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="abc@example.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={settingsForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="********"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={settingsForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="********"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={settingsForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a value" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.isOAuth === false && (
                <FormField
                  control={settingsForm.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Two Factor Authentication</FormLabel>
                        <FormDescription>
                          Enable 2FA for your account
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          disabled={isPending}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            {error.error && <FormError message={error.message} />}
            {success.success && <FormSuccess message={success.message} />}
            <Button type="submit" disabled={isPending}>
              {isPending ? <BeatLoader color="white" size="15px" /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default SettingsPage;
