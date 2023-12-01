"use client";

import React from "react";
import { toast } from "react-toastify";
import * as yup from "yup";

import Link from "next/link";
import { useFormik } from "formik";
import { Button, Input } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import AuthFormContainer from "#components/AuthFormContainer";
import { filterFormikErrors } from "#utils/formikHelpers";
import { CreateUserSchema } from "#utils/validationSchema";

export default function SignUp() {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: CreateUserSchema,
    onSubmit: async (values, action) => {
      action.setSubmitting(true);

      const res = await fetch("/api/users/signup", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (res.ok) {
        const { message } = (await res.json()) as { message: string };
        toast.success(message);
      }

      const { message, error } = (await res.json()) as {
        message: string;
        error: string;
      };
      if (res.ok) {
        toast.success(message);
        // await signIn("credentials", { email, password });
      }

      if (!res.ok && error) {
        toast.error(error);
      }
      action.setSubmitting(false);
    },
  });

  const formErrors: string[] = filterFormikErrors(errors, touched, values);

  const { email, name, password } = values;

  type valueKeys = keyof typeof values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="Create New Account" onSubmit={handleSubmit}>
      <Input
        name="name"
        label="Name"
        onBlur={handleBlur}
        onChange={handleChange}
        value={name}
        error={error("name")}
      />
      <Input
        name="email"
        label="Email"
        onBlur={handleBlur}
        onChange={handleChange}
        value={email}
        error={error("email")}
      />
      <Input
        name="password"
        label="Password"
        type="password"
        onChange={handleChange}
        onBlur={handleBlur}
        value={password}
        error={error("password")}
      />
      <Button disabled={isSubmitting} type="submit" className="w-full">
        Sign up
      </Button>

      <div className="flex items-center justify-between">
        <Link href="/auth/signin">Sign in</Link>
        <Link href="/auth/forget-password">Forget password</Link>
      </div>

      <div className="">
        {formErrors.map((err) => {
          return (
            <div key={err} className="space-x-1 flex items-center text-red-500">
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{err}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}
