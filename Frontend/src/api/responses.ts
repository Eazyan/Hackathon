import { Question } from "../types/questionResponse";
import { $host } from "./index";

export async function question(params: Question): Promise<any> {
  try {
    const response = await $host.post<any>("/assist", params);
    console.log(response.data); // Выведите полный ответ сервера для отладки
    return response.data; // Доступ к данным ответа сервера через response.data
  } catch (error) {
    throw error; // Выбросить ошибку, если запрос завершился неудачей
  }
}