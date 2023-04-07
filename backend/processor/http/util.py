import datetime
import typing
from typing import Tuple, Any

import pydantic

from base import model
from base.enums import FilterOperator, SortOrder
import exceptions as exc  # noqa


def timezone_validate(time: datetime.datetime) -> datetime.datetime:
    converted = pydantic.datetime_parse.parse_datetime(time)

    if converted.tzinfo is not None:
        # Convert to server time
        converted = converted.astimezone().replace(tzinfo=None)

    return converted


def time_to_time_slot(time: datetime.time) -> int:
    return time.hour * 2 + int(time.minute >= 30) + 1


def parse_filter(column_types: dict[str, type], filters: typing.Optional[pydantic.Json] = None) -> typing.Sequence[model.Filter]:
    filters: list[model.Filter] = pydantic.parse_obj_as(list[model.Filter], filters or [])
    for i, filter_ in enumerate(filters):
        try:
            to_parse_type = column_types[filter_.field]
        except KeyError:
            raise exc.IllegalInput

        if filter_.op in (FilterOperator.in_, FilterOperator.not_in):
            to_parse_type = set[to_parse_type]
        if filter_.op in (FilterOperator.between, FilterOperator.not_between):
            to_parse_type = tuple[to_parse_type, to_parse_type]
        if filter_.op in (FilterOperator.like, FilterOperator.not_like):
            to_parse_type = str

        try:
            converted = model.Filter(field=filter_.field, op=filter_.op,
                                     value=pydantic.parse_obj_as(to_parse_type, filter_.value))
        except pydantic.ValidationError:
            raise exc.IllegalInput

        if filter_.op in (FilterOperator.between, FilterOperator.not_between):
            if len(converted.value) != 2:
                raise exc.IllegalInput
        if filter_.op in (FilterOperator.like, FilterOperator.not_like):
            if column_types[converted.field] != str:
                raise exc.IllegalInput

        filters[i] = converted

    return filters


def parse_sorter(column_types: dict[str, type], sorters: typing.Optional[pydantic.Json] = None) -> typing.Sequence[model.Sorter]:  # noqa
    sorters = pydantic.parse_obj_as(list[model.Sorter], sorters or [])

    if any(sorter.field not in column_types for sorter in sorters):
        raise exc.IllegalInput

    return sorters
