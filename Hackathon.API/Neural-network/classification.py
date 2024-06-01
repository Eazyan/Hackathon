import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pymorphy3
import json
from model import generate_answer

nltk.download("punkt")
nltk.download("stopwords")

morph = pymorphy3.MorphAnalyzer()

stop_words = set(stopwords.words('russian'))

def lemmatize_text(text):
    
    text = text.lower()
    words = word_tokenize(text, language="russian")
    words = [word for word in words if word.isalnum() and word not in stop_words]
    lemmatized_words = [morph.parse(word)[0].normal_form for word in words]

    return ' '.join(lemmatized_words)

def get_fields_by_title(json_data, title):
    for item in json_data['data']:
        if item['title'] == title:
            return {
                "question": f"{title}",
                "answer": item.get("description"),
                "url": item.get("url"),
            }
    return None

json_file_path = './data-base/dataset.json'

with open(json_file_path, 'r', encoding='utf-8') as file:
    dataset = json.load(file)

titles = [item['title'] for item in dataset['data']]

def save_json(data, file_path):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
# Массив для лемматизированных вопросов
lemmatized_questions = []

# Цикл для лемматизации каждого вопроса
for question in titles:
    lemmatized_question = lemmatize_text(question)
    lemmatized_questions.append({"question": question, "lemmatized_question": lemmatized_question})

questions = [item["lemmatized_question"] for item in lemmatized_questions]
# Токенизация и векторизация
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(questions)
# Создание функции для нахождения ближайшего вопроса и всех вопросов на небольшом расстоянии от него
def find_closest_questions(user_question, extra_threshold=0.01):
    lemmatized_user_question = lemmatize_text(user_question)
    user_question_vec = vectorizer.transform([lemmatized_user_question])
    similarities = cosine_similarity(user_question_vec, X).flatten()
    
    # Находим индекс ближайшего вопроса
    closest_idx = np.argmax(similarities)
    max_similarity = similarities[closest_idx]
    
    # Устанавливаем пороговое значение
    threshold = max_similarity - extra_threshold
    
    # Находим все вопросы, которые находятся в пределах порогового значения
    closest_indices = np.where(similarities >= threshold)[0]
    return closest_indices
def get_answers(user_question, extra_threshold=0.01, max_answers=7):
    closest_indices = find_closest_questions(user_question, extra_threshold)
    return [lemmatized_questions[idx]["question"] for idx in closest_indices[:max_answers]]
# Пример использования
def answer(user_question: str) -> None:
    answers = get_answers(user_question, extra_threshold=0.095)
    print(f"Вопрос: {user_question}\nОтветы:")

    prompt = []

    for answer in answers:
        result = get_fields_by_title(dataset, answer)
        prompt.append(result)

    print(prompt)
    json_file_path = './querry/prompt.json'

    # Запись обновленных данных в JSON-файл
    save_json(prompt, json_file_path)

    return generate_answer(user_question)
