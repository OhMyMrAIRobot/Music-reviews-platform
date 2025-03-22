const errorTranslations: Record<string, string> = {
	'Invalid credentials': 'Неверный логин или пароль!',

	'password must be longer than or equal to 6 characters':
		'Пароль должен содержать не менее 6 символов!',

	'password must be shorter than or equal to 64 characters':
		'Пароль не должен содержать более 64 символов!',

	'email must be longer than or equal to 1 characters':
		'Email не должен быть пустым!',

	'email must be an email': 'Некорректный формат email!',
}

export const translateError = (message: string): string => {
	return errorTranslations[message] || 'Неизвестная ошибка'
}
