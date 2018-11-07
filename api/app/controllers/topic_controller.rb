class TopicController < ApplicationController
  before_action :authenticate_user

  def queue
    completions = current_user.completions.map { |c| c.topic_id }
    queue = Topic.all.map { |t| t.id } - completions

    Requirement.all.each do |r|
      unless completions.include?(r.required_topic.id)
        queue.delete r.topic.id
      end
    end

    topics = Topic.find(queue)
    courses = Course.find topics.map { |t| t.course_id }

    render json: { topics: topics, courses: courses }
  end

  def complete
    completion = Completion.new user: current_user, topic_id: params[:id].to_i
    render json: completion.save
  end
end
