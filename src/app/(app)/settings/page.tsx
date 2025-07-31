import { SettingsForm } from "@/components/settings/settings-form";
import { PasswordSettingsForm } from "@/components/settings/password-settings-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
             <div>
                 <h1 className="text-3xl font-bold font-headline">Settings</h1>
                 <p className="text-muted-foreground">Manage your application settings and preferences.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Application Settings</CardTitle>
                    <CardDescription>Customize the look and feel of the application.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingsForm />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Authentication</CardTitle>
                    <CardDescription>Manage your account password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PasswordSettingsForm />
                </CardContent>
            </Card>
        </div>
    );
}
