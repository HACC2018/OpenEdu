class TopicController < ApplicationController
  before_action :authenticate_user

  def queue
    completions = current_user.completions.map { |c| c.topic_id }
    all_topics = Hash[Topic.all.map { |t| [t.id, t.as_json.merge({status: "new"})] }]

    Requirement.all.each do |r|
      unless completions.include?(r.required_topic.id)
        all_topics[r.topic_id][:status] = "locked"
      end
    end

    completions.each do |c|
      all_topics[c][:status] = "completed"
    end

    current_user.reviews.each do |r|
      if all_topics[r.topic_id]
        if r.time <= Time.now
          all_topics[r.topic_id][:status] = "reviewing"
        else
          all_topics[r.topic_id][:status] = "in_progress"
          all_topics[r.topic_id][:next_review] = r.time
        end
        all_topics[r.topic_id][:times_left] = 2 - r.times
      end
    end

    courses = Course.all

    render json: { topics: all_topics,
                   courses: courses }
  end

  def correct
    topic_id = params[:id].to_i
    review = Review.where(user: current_user, topic_id: topic_id).first

    if review
      if review.times >= 1
        completion = Completion.new user: current_user, topic_id: topic_id
        review.destroy
        render json: completion.save
      else
        review.times += 1
        review.time = Time.now + 5
        render json: review.save
      end
    else
      review = Review.create user: current_user,
                             topic_id: topic_id,
                             times: 0,
                             time: Time.now + 5

      render json: review.save
    end
  end

  def incorrect
    topic_id = params[:id].to_i
    review = Review.where(user: current_user, topic_id: topic_id).first
    Completion.where(user: current_user, topic_id: topic_id).destroy_all

    if review
      review.times = 1
      review.time = Time.now + 5

      render json: review.save
    end
  end
end
