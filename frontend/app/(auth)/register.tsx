import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import React, { useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import VerificationModal from "@/components/VerificationModal";
import { register as registerUser } from "@/services/authService";

import { connectSocket } from "@/socket/socket";

const Register = () => {

    const nameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState("");

    const router = useRouter();

    const { signUp, updateToken } = useAuth();

    const handleVerifySuccess = async (token: string, user: any) => {
        setShowVerification(false);
        await updateToken(token);
        await connectSocket();
        router.replace("/(main)/home");
    };

    const handleSubmit = async () => {
        const name = nameRef.current.trim();
        const email = emailRef.current.trim().toLowerCase();
        const password = passwordRef.current;

        if (!name || !email || !password) {
            Alert.alert("Sign Up", "Please fill all the fields");
            return;
        }

        // // is there "edu" after the "@"
        // const atIndex = email.indexOf("@");
        // if (atIndex === -1 || !email.substring(atIndex + 1).includes("edu")) {
        //     Alert.alert(
        //         "Only Student Emails",
        //         "Please use your university email that contains 'edu' after @\n\nExample: name@university.edu.tr",
        //         [{ text: "OK" }]
        //     );
        //     return;
        // }

        try {
            setIsLoading(true);
            const res: any = await registerUser(email, password, name, "");

            if (res.success && res.requiresVerification) {
                setVerificationEmail(res.email);
                setShowVerification(true);
            } else {
                // Should not happen with new flow but just in case
                Alert.alert("Success", "Account created!");
                router.replace("/(auth)/login");
            }

        } catch (error: any) {
            Alert.alert("Registration Error", error.message || "Bir hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
            <ScreenWrapper showPattern={true}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <BackButton iconSize={28} />
                        <Typo size={17} color={colors.white}>
                            Need some help?
                        </Typo>
                    </View>

                    <View style={styles.content}>
                        <ScrollView
                            contentContainerStyle={styles.form}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ gap: spacingY._10, marginBottom: spacingY._15 }}>
                                <Typo size={28} fontWeight={"600"}>
                                    Getting Started
                                </Typo>
                                <Typo color={colors.neutral600}>
                                    Create an account to continue
                                </Typo>
                            </View>

                            <Input
                                placeholder="Enter your name"
                                onChangeText={(value: string) => nameRef.current = value}
                                icon={
                                    <Icons.User
                                        size={verticalScale(26)}
                                        color="colors.neutral600"
                                    />
                                }
                            />
                            <Input
                                placeholder="Enter your student email"
                                onChangeText={(value: string) => emailRef.current = value}
                                icon={
                                    <Icons.At
                                        size={verticalScale(26)}
                                        color="colors.neutral600"
                                    />
                                }
                            /><Input
                                placeholder="Enter your password"
                                secureTextEntry
                                onChangeText={(value: string) => passwordRef.current = value}
                                icon={
                                    <Icons.Lock
                                        size={verticalScale(26)}
                                        color="colors.neutral600"
                                    />
                                }
                            />

                            <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                                <Button loading={isLoading} onPress={handleSubmit}>
                                    <Typo fontWeight={"bold"} color={colors.black} size={20}>
                                        Sign Up</Typo>
                                </Button>

                                <View style={styles.footer}>
                                    <Typo>Already have an account?</Typo>
                                    <Pressable onPress={() => router.push("/(auth)/login")}>
                                        <Typo fontWeight={"bold"} color={colors.primaryDark}>
                                            Login
                                        </Typo>
                                    </Pressable>
                                </View>
                            </View>

                        </ScrollView>
                    </View>
                </View>
            </ScreenWrapper>
            <VerificationModal
                visible={showVerification}
                email={verificationEmail}
                onClose={() => setShowVerification(false)}
                onVerifySuccess={handleVerifySuccess}
            />
        </KeyboardAvoidingView>
    );

};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // gap: spacingY._30,
        // marginHorizontal: spacingX._20,  
        justifyContent: "space-between",
    },
    header: {
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._15,
        paddingBottom: spacingY._25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._20,
    },

    form: {
        gap: spacingY._15,
        marginTop: spacingY._20,
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
});
