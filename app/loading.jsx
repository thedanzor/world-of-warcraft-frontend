import LoadingSpinner from '@/core/components/LoadingSpinner'

export default function Loading() {
    return (
        <LoadingSpinner message="Loading Application..." minHeight="100vh" size={80} color="primary" />
    )
}
