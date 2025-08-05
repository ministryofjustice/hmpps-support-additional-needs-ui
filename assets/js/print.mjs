const initPrintLinks = () => {
  /**
   * Expand all the Details expander elements on print
   */
  const showDetailsElementOnPrint = () => {
    document.querySelectorAll('.govuk-details').forEach(details => {
      details.setAttribute('open', '')
    })
  }

  window.addEventListener('beforeprint', showDetailsElementOnPrint)

  /**
   * Handle the print page link event
   */
  const printLink = document.getElementById('print-link')

  const showPrintWindow = () => {
    window.print()
  }

  // Check that the print link exists before executing the event listener
  if (printLink) {
    printLink.addEventListener('click', showPrintWindow)
  }
}

export default initPrintLinks
