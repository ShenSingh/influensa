import apiClient from "@/services/config/apiClient";


interface requestBody {
    businessDetails: string;
}



    export const getRecommendInfluencer = async (details: string) => {
        try {

            const reguestBody: requestBody = {
                businessDetails: details
            }

            const response = await apiClient.post('/api/ai/recommend',reguestBody);
            // Add validation to ensure we return an array
            const recommendations = response.data?.recommendations;

            if (Array.isArray(recommendations)) {
                return recommendations;
            } else {
                console.warn('API response missing recommendations array:', response.data);
                return []; // Return empty array as fallback
            }

        } catch (error) {
            console.error('Error fetching user businesses:', error);
            throw error;
        }
    }


