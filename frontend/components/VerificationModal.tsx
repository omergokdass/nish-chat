import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Alert, Platform } from "react-native";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Typo from "./Typo";
import Input from "./Input";
import Button from "./Button";
import * as Icons from "phosphor-react-native";
import { verticalScale, scale } from "@/utils/styling";
import { resendCode, verifyCode } from "@/services/authService";

interface VerificationModalProps {
    visible: boolean;
    email: string;
    onClose: () => void;
    onVerifySuccess: (token: string, user: any) => void;
}

const VerificationModal = ({ visible, email, onClose, onVerifySuccess }: VerificationModalProps) => {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (visible && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [visible, timer]);

    const handleVerify = async () => {
        if (!code || code.length < 6) {
            Alert.alert("Verification", "Please enter a valid 6-digit code");
            return;
        }

        try {
            setLoading(true);
            const res = await verifyCode(email, code);
            if (res.success) {
                onVerifySuccess(res.token, res.user);
            }
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setLoading(true);
            await resendCode(email);
            setTimer(60);
            setCanResend(false);
            Alert.alert("Success", "Verification code sent again!");
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.container}>
                <View style={styles.content}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Icons.X size={24} color={colors.neutral600} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Icons.ShieldCheck size={48} color={colors.primary} weight="fill" />
                        <Typo size={22} fontWeight={"700"} color={colors.neutral900}>
                            Verify Your Email
                        </Typo>
                        <Typo size={14} color={colors.neutral500} style={styles.subtitle}>
                            We sent a verification code to {"\n"}
                            <Typo fontWeight={"600"} color={colors.neutral800}>{email}</Typo>
                        </Typo>
                    </View>

                    <View style={styles.form}>
                        <Input
                            placeholder="Enter 6-digit code"
                            value={code}
                            onChangeText={setCode}
                            keyboardType="number-pad"
                            maxLength={6}
                            containerStyle={{ alignItems: 'center' }}
                            icon={<Icons.Key size={24} color={colors.neutral400} />}
                        />

                        <Button loading={loading} onPress={handleVerify} style={styles.verifyButton}>
                            <Typo fontWeight={"700"} color={colors.white}>
                                Verify Email
                            </Typo>
                        </Button>

                        <View style={styles.resendContainer}>
                            <Typo size={14} color={colors.neutral500}>
                                Didn't receive code?
                            </Typo>
                            <TouchableOpacity onPress={handleResend} disabled={!canResend}>
                                <Typo
                                    size={14}
                                    fontWeight={"600"}
                                    color={canResend ? colors.primary : colors.neutral400}
                                >
                                    {canResend ? " Resend Code" : ` Resend in ${timer}s`}
                                </Typo>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: spacingX._20,
    },
    content: {
        width: "100%",
        backgroundColor: colors.white,
        borderRadius: radius._20,
        padding: spacingY._20,
        alignItems: "center",
        position: "relative",
    },
    closeButton: {
        position: "absolute",
        right: spacingX._15,
        top: spacingY._15,
        padding: 5,
        zIndex: 10,
    },
    header: {
        alignItems: "center",
        gap: spacingY._10,
        marginBottom: spacingY._20,
        marginTop: spacingY._10,
    },
    subtitle: {
        textAlign: "center",
        lineHeight: 20,
    },
    form: {
        width: "100%",
        gap: spacingY._15,
    },
    verifyButton: {
        marginTop: spacingY._10,
    },
    resendContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        marginTop: spacingY._5,
    },
});

export default VerificationModal;
