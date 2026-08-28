import { DomainEvents } from '@/core/events/domain-events.js'
import { EventHandler } from '@/core/events/event-handler.js'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository.js'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event.js'
import { SendNotificationUseCase } from '../use-cases/send-notification.js'

export class OnQuestionBestAnswerChosen implements EventHandler {
	constructor(
		private anwersRepository: AnswersRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions()
	}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendQuestionBestAnswerNotification.bind(this),
			QuestionBestAnswerChosenEvent.name,
		)
	}

	private async sendQuestionBestAnswerNotification({
		question,
		bestAnswerId,
	}: QuestionBestAnswerChosenEvent) {
		const answer = await this.anwersRepository.findById(bestAnswerId.toString())

		if (answer) {
			await this.sendNotification.execute({
				recipientId: answer?.authorId.toString(),
				title: `Sua resposta foi escolhida!`,
				content: `A resposta que você enviou em "${question.title.substring(0, 20).concat('...')}" foi escolhida pelo autor!`,
			})
		}
	}
}
