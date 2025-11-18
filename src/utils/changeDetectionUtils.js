export const getChangedFields = (originalObj, newObj) => {
  const changed = {};
  for (let key in newObj) {
    if (newObj[key] !== originalObj[key]) {
      changed[key] = newObj[key];
    }
  }
  return changed;
};
