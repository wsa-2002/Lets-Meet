import instance from "./axios";

export const emailVerification = async (code) => {
  try {
    const { data: result } = await instance.post(
      `/email-verification?code=${code}`
    );
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};
