import instance from "./axios";

export const member = async (identifier) => {
  try {
    const { data: result } = await instance.get(`/account/search`, {
      params: { identifier },
    });
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};
