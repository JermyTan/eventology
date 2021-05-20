from rest_framework import serializers


class GetEventSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=False)
    category = serializers.CharField(required=False)
    start_date_time = serializers.IntegerField(min_value=0, required=False)
    end_date_time = serializers.IntegerField(min_value=0, required=False)
    offset = serializers.IntegerField(min_value=0, required=False)
    limit = serializers.IntegerField(min_value=0, required=False)

    def validate(self, attrs):
        """
        Check that start_date_time is before end_date_time.
        """
        if (
            "start_date_time" in attrs
            and "end_date_time" in attrs
            and attrs["start_date_time"] > attrs["end_date_time"]
        ):
            raise serializers.ValidationError(
                "Event start date/time cannot be after end date/time"
            )

        return attrs


class GetAdditionalEventDataSerializer(serializers.Serializer):
    event_id = serializers.IntegerField(required=False)
    user_id = serializers.IntegerField(required=False)


class PostSerializer(serializers.Serializer):
    event_id = serializers.IntegerField()


class PostEventCommentSerializer(PostSerializer):
    content = serializers.CharField()


class DeleteSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.IntegerField())
