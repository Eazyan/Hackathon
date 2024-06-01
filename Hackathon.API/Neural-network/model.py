import torch
import json
from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig

def generate_answer(query: str) -> str:

    MODEL_NAME = "IlyaGusev/saiga_llama3_8b"
    # DEFAULT_SYSTEM_PROMPT = "Ты — Бот-ассистент финансовой компании Тинькофф. Твоя задача быть ботом QnA. Ты принимаешь на вход Вопросы, ответы к ним, и ссылки на статьи на сайте. Вопросов, ответов и ссылок в запросе может быть несколько, если это так, то они будут разделены специальным символом |, иначе вопрос лишь один. Ты должен вывести в красивой стилизации все вопросы, не генерируя новых. Следующим абзацем ты должен вывести ответы к ним и превратить их в один, общий, который будет содержать в себе общий ответ сразу на все вопросы. Следующим абзацем ты выводишь все ссылки. Всё должно быть красиво стилизованно."
    DEFAULT_SYSTEM_PROMPT = "Ты — Бот-ассистент финансовой компании Тинькофф. Твоя задача быть ботом QnA. Ты должен чётко и типизированно отвечать на вопросы. Ты принимаешь на вход Вопрос, ответ и URL на ресурс по теме. Таких может быть несколько, запросы разделены символом |. Твоя задача выдать в ответе сначала абзац про все вопросы, общая выжимка из них. Потом просто абзац ссылок на ресурсы. Ответ необходимо красиво и стилизованно оформить. Информация должна быть строго из запроса, как ответ, так и ресурсы должны основываться лишь строго на данной информации."

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        load_in_8bit=False,
        torch_dtype=torch.bfloat16,
        device_map="auto"
    )
    model.eval()

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    generation_config = GenerationConfig.from_pretrained(MODEL_NAME)
    
    with open('./querry/prompt.json', 'r', encoding='utf-8') as file:
        inputs = json.load(file)

    questions = []
    answers = []
    urls = []
    query = ''
    for item in inputs:
        query += "Вопрос: " + "".join(item['question']) + " Ответ: " + ''.join(item['answer']) + " URL: " + ''.join(item['url']) + " | "


    prompt = tokenizer.apply_chat_template([{
        "role": "system",
        "content": DEFAULT_SYSTEM_PROMPT
    }, {
        "role": "user",
        "content": query
    }], tokenize=False, add_generation_prompt=True)

    data = tokenizer(prompt, return_tensors="pt", add_special_tokens=False)
    data = {k: v.to(model.device) for k, v in data.items()}

    output_ids = model.generate(**data, generation_config=generation_config)[0]
    output_ids = output_ids[len(data["input_ids"][0]):]
    output = tokenizer.decode(output_ids, skip_special_tokens=True).strip()

    with open('./querry/prompt.json', 'w', encoding='utf-8') as file:
        json.dump([], file)

    return output
