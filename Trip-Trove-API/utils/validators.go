package utils

import (
	"github.com/go-playground/validator/v10"
	"unicode"
)

func NameValidator(fl validator.FieldLevel) bool {
	name := fl.Field().String()

	if len(name) < 3 || len(name) > 200 {
		return false
	}

	for _, char := range name {
		if !(char == ' ' || char == '-' || unicode.IsLetter(char) || unicode.IsDigit(char)) {
			return false
		}
	}

	return true
}

func LocationValidator(fl validator.FieldLevel) bool {
	location := fl.Field().String()

	if len(location) < 3 || len(location) > 50 {
		return false
	}

	for _, char := range location {
		if !(char == ' ' || char == '-' || unicode.IsLetter(char)) {
			return false
		}
	}

	return true
}

func CountryValidator(fl validator.FieldLevel) bool {
	country := fl.Field().String()

	if len(country) < 3 || len(country) > 50 {
		return false
	}

	for _, char := range country {
		if !(char == ' ' || char == '-' || unicode.IsLetter(char)) {
			return false
		}
	}

	return true
}

func DescriptionValidator(fl validator.FieldLevel) bool {
	description := fl.Field().String()

	if len(description) < 10 {
		return false
	}

	return true
}
