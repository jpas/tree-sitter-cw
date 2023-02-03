module.exports = grammar({
  name: "cw",

  extras: $ => [],

  conflicts: $ => [
    [ $._lvalue, $._rvalue ],
  ],

  rules: {
    source_file: $ => optional($._list),

    annotation: $ => prec(1, seq('#[', field('op', /\w+/), ']')),

    comment: $ => /#.*/,

    _ws: $ => repeat1(choice(
      $.comment,
      ' ',
      '\n',
      '\r',
      '\t',
    )),

    _list: $ => choice(
      $._ws,
      seq(
        optional($._ws),
        sep1($._list_item, $._ws),
        optional($._ws)
      ),
    ),

    _list_item: $ => choice(
      $.statement,
      $.if_list,
      $._rvalue,
    ),

    list: $ => choice(
      '{}',
      seq('{', $._list, '}'),
    ),

    if_list: $ => seq(
      '[[',
      field('macro', $.identifier),
      ']',
      $._list,
      ']',
    ),

    statement: $ => seq(
      field('left', $._lvalue),
      optional($._ws),
      field('op', $.operator),
      optional($._ws),
      field('right', $._rvalue),
    ),

    operator: $ => choice('=', '!=', '<=', '<', '>=', '>'),

    _bvalue: $ => choice(
      $.ref,
      $.ref_for,
      $.var,
      $.number,
      $.quoted,
    ),

    _lvalue: $ => choice(
      $._bvalue,
    ),

    _rvalue: $ => choice(
      $._bvalue,
      $.list,
      $.svalue,
      $.inline_arithmetic,
      $.inline_arithmetic2,
    ),

    digits: $ => /[0-9]+/,
    number: $ => prec(1, /[-+]?[0-9]+(\.[0-9]+)?/),

    identifier: $ => /[0-9_a-zA-Z\-.'/|$]+/,

    svalue: $ => prec(1, seq(
      'value:',
      field('value', $.identifier),
      optional(seq(
        '|',
        sep1(seq($.identifier, '|', $._bvalue), '|'),
        '|',
      ))
    )),

    macro: $ => seq(
      '$',
      field('name', $.identifier),
      optional(
        field('default', $.identifier),
      ),
      '$'
    ),

    var: $ => seq('@', $.identifier),

    ref: $ => seq(
      repeat(seq(
        field('prefix', $.identifier),
        ':',
      )),
      field('name', $.identifier),
    ),

    ref_for: $ => prec.right(seq(
      field('name', $.ref),
      '@',
      field('for', $.ref),
    )),

    quoted: $ => /"[^"]*"/,

    inline_arithmetic: $ => seq('@[', /[^]]*/, ']'),
    inline_arithmetic2: $ => seq('@\\[', /[^]]*/, ']'),

    //list: $ => seq('{', $._list, '}'),
    //_list: $ => repeat1(choice($.comment, prec.right($.stmt), prec.left($.val))),

    //stmt: $ => seq(
    //  field('left', $.key),
    //  field('op', $.stmt_op),
    //  field('right', $.val),
    //),
    //stmt_op: $ => choice('=', '<=', '<', '>=', '>'),

    //key: $ => choice(
    //  $.name,
    //  $.variable,
    //  $.number,
    //  $.quoted,
    //),

    //val: $ => choice(
    //  $.list,
    //  $.event,
    //  $.name_ref,
    //  $.variable,
    //  $.number,
    //  $.quoted,
    //),

    //name: $ => prec.right(sep1($.ident, $.name_op)),
    //name_op: $ => choice('.', '@', ':'),
    //name_ref: $ => seq($.name, optional($.params)),

    //params: $ => prec.right(seq('|', sep1($.param, '|'), '|')),
    //param: $ => seq(
    //  field('name', $.ident),
    //  '|',
    //  field('val', $.name),
    //),

    //variable: $ => seq('@', $.ident),

    //event: $ => seq($.ident, '.', /\d+/),

    //number: $ => /-?\d+(\.\d+)?/,
    //quoted: $ => /"[^"]*"/,
  }
})

function sep1(rule, separator) {
    return seq(rule, repeat(seq(separator, rule)))
}
