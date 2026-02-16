import { SignUp } from '@clerk/nextjs'

const page = () => {
    return (
        <SignUp
            appearance={{
                elements: {
                    card: "w-[400px]",
                    headerTitle: "text-lg",
                    headerSubtitle: "text-sm",
                    formFieldInput: "py-1.5 text-sm",
                    formFieldLabel: "text-sm",
                    formButtonPrimary: "py-2 text-sm",
                    footerActionText: "text-sm",
                },
                variables: {
                    spacingUnit: "0.75rem",
                },
            }}
        />
    )
}

export default page
