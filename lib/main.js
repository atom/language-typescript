exports.activate = function () {
  for (const scopeName of ['source.ts', 'source.flow']) {
    atom.grammars.addInjectionPoint(scopeName, {
      type: 'call_expression',

      language (callExpression) {
        const {firstChild} = callExpression
        switch (firstChild.type) {
          case 'identifier':
            return languageStringForTemplateTag(firstChild.text)
          case 'member_expression':
            if (firstChild.startPosition.row === firstChild.endPosition.row) {
              return languageStringForTemplateTag(firstChild.text)
            }
        }
      },

      content (callExpression) {
        const {lastChild} = callExpression
        if (lastChild.type === 'template_string') {
          return lastChild
        }
      }
    })

    atom.grammars.addInjectionPoint(scopeName, {
      type: 'assignment_expression',

      language (callExpression) {
        const {firstChild} = callExpression
        if (firstChild.type === 'member_expression') {
          if (firstChild.lastChild.text === 'innerHTML') {
            return 'html'
          }
        }
      },

      content (callExpression) {
        const {lastChild} = callExpression
        if (lastChild.type === 'template_string') {
          return lastChild
        }
      }
    })

    atom.grammars.addInjectionPoint(scopeName, {
      type: 'regex_pattern',
      language (regex) { return 'regex' },
      content (regex) { return regex }
    })
  }
}

const CSS_REGEX = /\bstyled\b|\bcss\b/i
const GQL_REGEX = /\bg(raph)?ql\b/i
const SQL_REGEX = /\bsql\b/i

function languageStringForTemplateTag (tag) {
  if (CSS_REGEX.test(tag)) {
    return 'CSS'
  } else if (GQL_REGEX.test(tag)) {
    return 'GraphQL'
  } else if (SQL_REGEX.test(tag)) {
    return 'SQL'
  } else {
    return tag
  }
}
