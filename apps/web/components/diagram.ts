// Story diagram for the landing page, validated with @vhyxchart/core parse().
export const AGENT_STORY = `flowchart LR
  user([Person]) --> page[Your page]
  agent([AI agent]) --> manifest[Manifest]
  page --> button[Delete project]
  manifest --> button
  button --> confirm{{Confirm dialog}}
  confirm --> api[(API)]

scenario A person clicks
  user -> page : click
  page -> button
  button is active
  button -> confirm
  confirm is done
  confirm -> api : DELETE
  api is done

scenario An agent tries the same action
  agent -> manifest : read contracts
  manifest -> button : critical, needs confirmation
  button is warn
  button -> confirm : ask the person
  confirm is active
  confirm -> api : approved
  api is done`;
