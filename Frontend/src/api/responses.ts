import { $host } from "./index";

export async function question(query: string): Promise<any> {
  try {
    const response = await $host.post<any>("/assist", null, { params: { query } });
    console.log(response.data); // Выведите полный ответ сервера для отладки
    return response.data; // Доступ к данным ответа сервера через response.data
  } catch (error) {
    throw error; // Выбросить ошибку, если запрос завершился неудачей
  }
}