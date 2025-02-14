import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";

const Auth = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);

        // Preserve email and password when switching modes
        const { email, password } = formData;
        setFormData({
            firstName: "",
            lastName: "",
            email: email,
            password: password,
            confirmPassword: "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would handle the auth logic
        console.log("Form submitted:", formData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const FormInput = ({ name, label, type = "text", half = false }) => (
        <div className={`${half ? "w-1/2" : "w-full"} px-2 mb-4`}>
            <div className="relative">
                <Input
                    name={name}
                    type={name === "password" || name === "confirmPassword"
                        ? (showPassword ? "text" : "password")
                        : type}
                    placeholder={label}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full"
                    required
                />
                {(name === "password" || name === "confirmPassword") && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Lock className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {isSignup ? "Sign Up" : "Sign In"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="flex flex-wrap -mx-2">
                            {isSignup && (
                                <>
                                    <FormInput
                                        name="firstName"
                                        label="First Name"
                                        half
                                    />
                                    <FormInput
                                        name="lastName"
                                        label="Last Name"
                                        half
                                    />
                                </>
                            )}
                            <FormInput
                                name="email"
                                label="Email Address"
                                type="email"
                            />
                            <FormInput
                                name="password"
                                label="Password"
                            />
                            {isSignup && (
                                <FormInput
                                    name="confirmPassword"
                                    label="Repeat Password"
                                />
                            )}
                        </div>

                        <div className="space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
                            >
                                {isSignup ? "Sign Up" : "Sign In"}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={switchMode}
                                className="w-full"
                            >
                                {isSignup
                                    ? "Already have an account? Sign In"
                                    : "Don't have an account? Sign Up"
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Auth;