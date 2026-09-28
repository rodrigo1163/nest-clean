import { ValueObject } from '#/core/entities/value-object.js'

export interface CommentWithAuthorProps {
	commentId: string
	content: string
	authorId: string
	author: string
	createdAt: Date
	upadatedAt?: Date | null
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
	get commentId() {
		return this.props.commentId
	}
	get content() {
		return this.props.content
	}
	get authorId() {
		return this.props.authorId
	}
	get author() {
		return this.props.author
	}
	get createdAt() {
		return this.props.createdAt
	}
	get upadatedAt() {
		return this.props.upadatedAt
	}

	static create(props: CommentWithAuthorProps) {
		return new CommentWithAuthor(props)
	}
}
