const { Telegraf, Markup, Extra } = require('telegraf')

const {
    sendTimetable,
    timetableToday,
    timetableTomorrow,
} = require('./timetable.js')

const bot = new Telegraf(process.env.TOKEN)

bot.start(({ reply }) => {
    return reply('👀', Markup
        .keyboard(['Лекции сегодня', 'Лекции завтра'])
        .resize()
        .extra()
  )
})

bot.hears('Лекции сегодня', sendTimetable(timetableToday()))
bot.hears('Лекции завтра', sendTimetable(timetableTomorrow()))

bot.command('/today', sendTimetable(timetableToday()))
bot.command('/tomorrow', sendTimetable(timetableTomorrow()))

bot.on('inline_query', (ctx) => {
    try {
        const formattedTimetableToday = timetableToday()
        const formattedTimetableTomorrow = timetableTomorrow()

        return ctx.answerInlineQuery([
            {
                type: 'article',
                id: 'today',
                title: 'Лекции сегодня',
                input_message_content: {
                    message_text: formattedTimetableToday ? `<b>Лекции сегодня</b>\n\n${formattedTimetableToday}` : 'Сегодня пар нет',
                    ...Extra.HTML().webPreview(false),
                },
            },
            {
                type: 'article',
                id: 'tomorrow',
                title: 'Лекции завтра',
                input_message_content: {
                    message_text: formattedTimetableTomorrow ?  `<b>Лекции завтра</b>\n\n${formattedTimetableTomorrow}` : 'Завтра пар нет',
                    ...Extra.HTML().webPreview(false),
                },
            }
        ], {
            cache_time: 20,
        })
    } catch (e) {
        console.log(e)
    }
})

bot.launch()
