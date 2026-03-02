import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/infrastructure/state/store";
import {
  fetchMerchant,
  setAcceptance,
} from "@/infrastructure/state/slices/orderSlice";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";

export function AcceptanceStep() {
  const dispatch = useDispatch<AppDispatch>();
  const { merchant, acceptedTerms, acceptedData, loading } = useSelector(
    (state: RootState) => state.order,
  );

  useEffect(() => {
    if (!merchant) {
      dispatch(fetchMerchant());
    }
  }, [dispatch, merchant]);

  if (loading && !merchant) {
    return (
      <div className="flex justify-center p-4">
        <Spinner size="sm" />
      </div>
    );
  }

  if (!merchant) return null;

  const { presigned_acceptance, presigned_personal_data_auth } = merchant;

  return (
    <div className="space-y-4 border-t border-gray-100 pt-6 mt-6">
      <div className="flex items-start space-x-3 group">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) =>
            dispatch(setAcceptance({ terms: !!checked, data: acceptedData }))
          }
          className="mt-1 transition-transform group-hover:scale-110"
        />
        <label
          htmlFor="terms"
          className="text-sm text-gray-600 leading-relaxed cursor-pointer select-none"
        >
          Acepto haber leído los{" "}
          <a
            href={presigned_acceptance.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-bold hover:underline"
          >
            reglamentos
          </a>{" "}
          y la{" "}
          <a
            href={presigned_acceptance.permalink} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-bold hover:underline"
          >
            política de privacidad
          </a>{" "}
          para hacer este pago.
        </label>
      </div>

      <div className="flex items-start space-x-3 group">
        <Checkbox
          id="data"
          checked={acceptedData}
          onCheckedChange={(checked) =>
            dispatch(setAcceptance({ terms: acceptedTerms, data: !!checked }))
          }
          className="mt-1 transition-transform group-hover:scale-110"
        />
        <label
          htmlFor="data"
          className="text-sm text-gray-600 leading-relaxed cursor-pointer select-none"
        >
          Acepto la{" "}
          <a
            href={presigned_personal_data_auth.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-bold hover:underline"
          >
            autorización para la administración de datos personales
          </a>
        </label>
      </div>
    </div>
  );
}
