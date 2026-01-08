import { computed, ref } from 'vue';
import useVuelidate from '@vuelidate/core';

/**
 * Shared wrapper around Vuelidate that exposes helpers
 * for field-level classes/messages and API-driven errors.
**/
export function useGenericVuelidate(form, rules, options = {}) {
  const {
    vuelidateOptions = {},
  } = options;

  const externalErrors = ref({});

  const v$ = useVuelidate(rules, form, {
    $autoDirty: true,
    $lazy: true,
    ...vuelidateOptions,
  });

  const getFieldNode = (path) => {
    if (!path) return undefined;
    return path.split('.').reduce((acc, key) => acc?.[key], v$.value);
  };

  const fieldState = (path) =>
    computed(() => {
      if (!path) return '';
      if (externalErrors.value[path]) return 'invalid';

      const node = getFieldNode(path);
      if (!node) return '';

      if (node.$error) return 'invalid';
      if (!node.$invalid && node.$dirty) return 'valid';
      return '';
    });

  const fieldError = (path) =>
    computed(() => {
      if (!path) return '';
      if (externalErrors.value[path]) return externalErrors.value[path];

      const node = getFieldNode(path);
      if (!node) return '';

      const [firstError] = node.$errors || [];
      if (!firstError) return '';

      return typeof firstError.$message === 'function'
        ? firstError.$message()
        : firstError.$message;
    });

  const touchField = (path) => {
    const node = getFieldNode(path);
    node?.$touch();
  };

  const resetValidation = () => {
    externalErrors.value = {};
    v$.value.$reset();
  };

  const setExternalErrors = (errors = {}) => {
    externalErrors.value = { ...errors };
  };

  const clearExternalError = (path) => {
    if (!path || !externalErrors.value[path]) return;
    const { [path]: _removed, ...rest } = externalErrors.value;
    externalErrors.value = rest;
  };

  return {
    v$,
    fieldState,
    fieldError,
    touchField,
    resetValidation,
    setExternalErrors,
    clearExternalError,
    externalErrors,
  };
}

export default useGenericVuelidate;

