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

    courses = Course.all

    render json: { topics: all_topics,
                   courses: courses }
  end

  def complete
    completion = Completion.new user: current_user, topic_id: params[:id].to_i
    render json: completion.save
  end
end
