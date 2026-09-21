export const exportRecipePdf = async (recipe) => {
  if (typeof window === 'undefined' || !window.print) throw new Error('PDF export requires a browser print adapter.');
  const printable = { ...recipe, exportedAt: new Date().toISOString() };
  window.dispatchEvent(new CustomEvent('fermentationlab:print-recipe', { detail: printable }));
  window.print();
  return printable;
};
